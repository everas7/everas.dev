import Image from './Image'
import Link from './Link'

type CardProps = {
  title: string
  description: string
  imgSrc?: string
  href?: string
  as?: 'h2' | 'h3'
  meta?: string
  // 'stacked' is a full-width card with a smaller title, for a single column.
  variant?: 'grid' | 'stacked'
}

const Card = ({
  title,
  description,
  imgSrc,
  href,
  as: Heading = 'h2',
  meta,
  variant = 'grid',
}: CardProps) => {
  const stacked = variant === 'stacked'

  return (
    <div className={stacked ? undefined : 'md max-w-[544px] p-4 md:w-1/2'}>
      <div
        className={`${
          imgSrc && 'h-full'
        }  overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
      >
        {imgSrc &&
          (href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-36 lg:h-48"
                width={544}
                height={306}
              />
            </Link>
          ) : (
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          ))}
        <div className="p-6">
          <Heading
            className={
              stacked
                ? 'text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100'
                : 'mb-3 text-2xl font-bold leading-8 tracking-tight'
            }
          >
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </Heading>
          {meta && (
            <p className="mb-3 text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              {meta}
            </p>
          )}
          <p
            className={`prose max-w-none text-gray-500 dark:text-gray-400 ${stacked ? '' : 'mb-3'}`}
          >
            {description}
          </p>
          {href && (
            <Link
              href={href}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${title}`}
            >
              Learn more &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
